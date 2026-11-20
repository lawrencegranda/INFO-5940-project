#!/bin/sh
set -eu
export OLLAMA_HOST=127.0.0.1:11435
export OLLAMA_ORIGINS=chrome-extension://amgmmlmejpmclbcciahcpfbaijepimgn
export OLLAMA_NO_CLOUD=1
exec ollama serve
