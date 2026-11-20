import Foundation
import AppKit
import PDFKit
import Vision
import ImageIO

struct Segment: Codable { let text: String; let location: String }
struct Output: Codable { let segments: [Segment]; let limitations: [String]; let partial: Bool; let adapter: String }
var segments: [Segment] = []
var limitations: [String] = []
var partial = false
var usedOCR = false

func recognize(_ image: CGImage, prefix: String) throws -> [Segment] {
    usedOCR = true
    let request = VNRecognizeTextRequest()
    request.usesCPUOnly = true
    request.preferBackgroundProcessing = true
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = true
    if #available(macOS 13.0, *) { request.automaticallyDetectsLanguage = true }
    try VNImageRequestHandler(cgImage: image, options: [:]).perform([request])
    let observations = request.results ?? []
    if observations.isEmpty {
        partial = true
        limitations.append("\(prefix): no readable text was recognized.")
    }
    return observations.compactMap { observation in
        guard let candidate = observation.topCandidates(1).first else { return nil }
        if candidate.confidence < 0.5 {
            partial = true
            limitations.append("\(prefix): some OCR text has low confidence.")
        }
        let r = observation.boundingBox
        let region = String(format: "%.3f,%.3f,%.3f,%.3f", r.minX, r.minY, r.width, r.height)
        return Segment(text: candidate.string, location: "\(prefix), OCR region \(region)")
    }
}

do {
    guard CommandLine.arguments.count >= 3 else { throw NSError(domain: "Arguments", code: 1) }
    let kind = CommandLine.arguments[1]
    let url = URL(fileURLWithPath: CommandLine.arguments[2])
    if kind == "image" {
        guard let source = CGImageSourceCreateWithURL(url as CFURL, nil),
              let image = CGImageSourceCreateThumbnailAtIndex(source, 0, [
                kCGImageSourceCreateThumbnailFromImageAlways: true,
                kCGImageSourceThumbnailMaxPixelSize: 2400,
                kCGImageSourceCreateThumbnailWithTransform: true
              ] as CFDictionary) else {
            throw NSError(domain: "Unreadable image", code: 2)
        }
        if CGImageSourceGetCount(source) > 1 {
            partial = true
            limitations.append("Only the first image/frame was OCRed; the complete original is preserved.")
        }
        if let properties = CGImageSourceCopyPropertiesAtIndex(source, 0, nil) as? [String: Any],
           let width = properties[kCGImagePropertyPixelWidth as String] as? NSNumber,
           let height = properties[kCGImagePropertyPixelHeight as String] as? NSNumber,
           max(width.intValue, height.intValue) > 2400 {
            partial = true
            limitations.append("Image raster was limited to 2400 pixels for local OCR; inspect the full original for fine text.")
        }
        segments = try recognize(image, prefix: "image 1")
    } else if kind == "pdf" {
        guard let document = PDFDocument(url: url), !document.isLocked else {
            throw NSError(domain: "Unreadable or locked PDF", code: 3)
        }
        let limit = min(document.pageCount, 100)
        if document.pageCount > limit {
            partial = true
            limitations.append("Only the first \(limit) of \(document.pageCount) PDF pages were processed.")
        }
        for index in 0..<limit {
            guard let page = document.page(at: index) else {
                partial = true
                limitations.append("page \(index + 1): unavailable.")
                continue
            }
            let text = (page.string ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
            if !text.isEmpty {
                segments.append(Segment(text: text, location: "page \(index + 1)"))
            } else {
                let bounds = page.bounds(for: .mediaBox)
                let scale = 2400 / max(max(bounds.width, bounds.height), 1)
                let size = NSSize(width: max(bounds.width * scale, 1), height: max(bounds.height * scale, 1))
                let thumbnail = page.thumbnail(of: size, for: .mediaBox)
                if let image = thumbnail.cgImage(forProposedRect: nil, context: nil, hints: nil) {
                    segments += try recognize(image, prefix: "page \(index + 1)")
                } else {
                    partial = true
                    limitations.append("page \(index + 1): could not render for OCR.")
                }
            }
        }
    } else { throw NSError(domain: "Unsupported native operation", code: 4) }
    if usedOCR { limitations.append("OCR text is derived and may contain recognition errors; inspect the preserved original.") }
    if segments.isEmpty { partial = true }
    let output = Output(segments: segments, limitations: Array(Set(limitations)).sorted(),
                        partial: partial, adapter: usedOCR ? "apple-pdfkit-vision" : "apple-pdfkit")
    FileHandle.standardOutput.write(try JSONEncoder().encode(output))
} catch {
    FileHandle.standardError.write(Data("Local native extraction failed: \(error.localizedDescription)\n".utf8))
    exit(1)
}
