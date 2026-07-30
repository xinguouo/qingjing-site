"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type ComponentType,
  type DragEvent,
  type ReactNode,
} from "react";
import {insert, PatchEvent, setIfMissing, useClient} from "sanity";

type ArtworkImagesInputProps = {
  onChange: (event: PatchEvent) => void;
  readOnly?: boolean;
  renderDefault: (props: ArtworkImagesInputProps) => ReactNode;
};

type UploadedImageAsset = {
  _id: string;
};

const imageMimePrefix = "image/";

function createKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  }

  return Math.random().toString(36).slice(2, 14);
}

function filesFromList(fileList: FileList | null) {
  return Array.from(fileList || []).filter((file) =>
    file.type.startsWith(imageMimePrefix),
  );
}

function ArtworkImagesInputComponent(props: ArtworkImagesInputProps) {
  const {onChange, readOnly, renderDefault} = props;
  const client = useClient({apiVersion: "2025-01-01"});
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function uploadFiles(files: File[]) {
    if (readOnly || !files.length || isUploading) {
      return;
    }

    setIsUploading(true);
    setMessage("");

    try {
      const uploadedItems = [];

      for (const file of files) {
        const asset = await client.assets.upload("image", file, {
          filename: file.name,
        }) as UploadedImageAsset;

        uploadedItems.push({
          _key: createKey(),
          _type: "artworkImage",
          description: "",
          descriptionEn: "",
          descriptionZh: "",
          image: {
            _type: "image",
            asset: {
              _ref: asset._id,
              _type: "reference",
            },
          },
        });
      }

      onChange(PatchEvent.from([
        setIfMissing([]),
        insert(uploadedItems, "after", [-1]),
      ]));

      setMessage(`已添加 ${uploadedItems.length} 张图片 / Added ${uploadedItems.length} images`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "图片上传失败 / Upload failed");
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    void uploadFiles(filesFromList(event.dataTransfer.files));
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    void uploadFiles(filesFromList(event.target.files));
  }

  return (
    <div>
      <div
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        style={{
          background: isDragging ? "rgba(110, 130, 150, 0.14)" : "rgba(255, 255, 255, 0.04)",
          border: `1px dashed ${isDragging ? "rgba(110, 130, 150, 0.7)" : "rgba(110, 130, 150, 0.35)"}`,
          borderRadius: 10,
          marginBottom: 16,
          padding: 18,
        }}
      >
        <div style={{display: "flex", flexDirection: "column", gap: 10}}>
          <strong style={{fontSize: 14}}>
            批量上传作品图片 / Bulk Upload Artwork Images
          </strong>
          <span style={{color: "var(--card-muted-fg-color, #6f6f6f)", fontSize: 13, lineHeight: 1.6}}>
            可从 Windows 文件夹一次拖入多张图片。每张图片会自动生成独立条目，并保留当前列表中已有图片和说明。
          </span>
          <div>
            <button
              disabled={readOnly || isUploading}
              onClick={() => inputRef.current?.click()}
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(110, 130, 150, 0.35)",
                borderRadius: 999,
                cursor: readOnly || isUploading ? "not-allowed" : "pointer",
                fontSize: 13,
                padding: "8px 14px",
              }}
              type="button"
            >
              {isUploading ? "上传中... / Uploading..." : "选择多张图片 / Select Images"}
            </button>
          </div>
          {message ? (
            <span style={{color: "var(--card-muted-fg-color, #6f6f6f)", fontSize: 12}}>
              {message}
            </span>
          ) : null}
        </div>
        <input
          accept="image/*"
          multiple
          onChange={handleFileChange}
          ref={inputRef}
          style={{display: "none"}}
          type="file"
        />
      </div>
      {renderDefault(props)}
    </div>
  );
}

export const ArtworkImagesInput = ArtworkImagesInputComponent as ComponentType<any>;
