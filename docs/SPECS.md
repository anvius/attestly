# DocCum MVP Specification

Version: `0.1.0`

## Business Goal

Provide a simple and trustworthy way to certify digital content existence without storing full original content.

## Core Use Cases

1. Certify text content.
2. Certify file content.
3. Retrieve public certificate by ID.

## Certificate Fields

- `id`: unique UUID
- `hash`: SHA256 of input content
- `timestamp`: server UTC timestamp
- `fileName`: optional file name
- `contentType`: optional MIME type
- `originalContentPreview`: short preview string

## Constraints

- No original full content persistence.
- Hash algorithm is SHA256 only.
- SQLite for MVP persistence.
- Public read access through unique URL.
