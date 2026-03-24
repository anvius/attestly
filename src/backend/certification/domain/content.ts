export type ContentTypeEnum = "FILE" | "TEXT";

type ContentMetadata = {
  fileName: string | null;
  contentType: string | null;
};

export class Content {
  public readonly type: ContentTypeEnum;
  private readonly data: Uint8Array;
  private readonly metadata: ContentMetadata;

  private constructor(type: ContentTypeEnum, data: Uint8Array, metadata: ContentMetadata) {
    this.type = type;
    this.data = data;
    this.metadata = metadata;
  }

  static fromText(text: string): Content {
    const normalized = text.trim();

    if (!normalized) {
      throw new Error("Text content cannot be empty");
    }

    return new Content("TEXT", new TextEncoder().encode(text), {
      fileName: null,
      contentType: "text/plain"
    });
  }

  static fromFile(data: Uint8Array, contentType: string | null, fileName: string | null): Content {
    if (data.byteLength === 0) {
      throw new Error("File content cannot be empty");
    }

    return new Content("FILE", data, {
      fileName,
      contentType
    });
  }

  get byteLength(): number {
    return this.data.byteLength;
  }

  get fileName(): string | null {
    return this.metadata.fileName;
  }

  get contentType(): string | null {
    return this.metadata.contentType;
  }

  asBytes(): Uint8Array {
    return this.data;
  }

  asString(): string {
    return new TextDecoder().decode(this.data);
  }
}
