# Docx to PDF Converter

This is a simple Dockerized application that allows you to convert DOCX files to PDF by sending a POST request to the endpoint /convert

## Getting Started

Follow these steps to run the application on your local machine using Docker.

### Prerequisites

- Docker installed on your system.

### Installation and Usage

1. Clone the repository to your local machine:

```sh
git clone git@github.com:babdulhakim2/docx-to-pdf-converter.git

cd docx-to-pdf-converter

docker build -t docx-to-pdf-converter .

docker run -p 80:80 -d docx-to-pdf-converter


```


