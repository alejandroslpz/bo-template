"use client";

import { UploadCloudIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { type DragEvent, useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/lib/supabase/storage";
import { cn } from "@/lib/utils";

type FileUploadProps = {
	bucket?: string;
	onUpload?: (url: string) => void;
	accept?: string;
	maxSize?: number;
	className?: string;
};

export function FileUpload({
	bucket = "uploads",
	onUpload,
	accept = "image/jpeg,image/png,image/gif,image/webp",
	maxSize = 5 * 1024 * 1024,
	className,
}: FileUploadProps) {
	const [preview, setPreview] = useState<string | null>(null);
	const [fileName, setFileName] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [isPending, setIsPending] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const resetState = useCallback(() => {
		setPreview(null);
		setFileName(null);
		if (inputRef.current) {
			inputRef.current.value = "";
		}
	}, []);

	const handleFile = useCallback(
		async (file: File) => {
			if (file.size > maxSize) {
				toast.error(
					`File size exceeds the ${Math.round(maxSize / 1024 / 1024)}MB limit.`,
				);
				return;
			}

			const acceptedTypes = accept.split(",").map((t) => t.trim());
			if (!acceptedTypes.includes(file.type)) {
				toast.error("Invalid file type.");
				return;
			}

			setFileName(file.name);

			if (file.type.startsWith("image/")) {
				const reader = new FileReader();
				reader.onload = (e) => {
					setPreview(e.target?.result as string);
				};
				reader.readAsDataURL(file);
			}

			setIsPending(true);

			const formData = new FormData();
			formData.set("file", file);
			formData.set("bucket", bucket);

			const result = await uploadFile(formData);

			setIsPending(false);

			if (result.error) {
				toast.error(result.error);
				resetState();
				return;
			}

			if (result.url) {
				toast.success("File uploaded successfully.");
				onUpload?.(result.url);
			}
		},
		[accept, bucket, maxSize, onUpload, resetState],
	);

	const handleDragOver = useCallback((e: DragEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: DragEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		(e: DragEvent<HTMLButtonElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);

			const file = e.dataTransfer.files[0];
			if (file) {
				handleFile(file);
			}
		},
		[handleFile],
	);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) {
				handleFile(file);
			}
		},
		[handleFile],
	);

	const handleClick = useCallback(() => {
		inputRef.current?.click();
	}, []);

	return (
		<div className={cn("w-full", className)}>
			<button
				type="button"
				onClick={handleClick}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={cn(
					"relative flex min-h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
					isDragging
						? "border-primary bg-primary/5"
						: "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
					isPending && "pointer-events-none opacity-60",
				)}
			>
				<input
					ref={inputRef}
					type="file"
					accept={accept}
					onChange={handleInputChange}
					className="hidden"
					disabled={isPending}
				/>

				{preview ? (
					<div className="flex flex-col items-center gap-3">
						<Image
							src={preview}
							alt="Preview"
							width={96}
							height={96}
							className="max-h-24 max-w-24 rounded-md object-cover"
							unoptimized
						/>
						<p className="text-muted-foreground max-w-full truncate text-sm">
							{fileName}
						</p>
						{isPending && (
							<div className="flex items-center gap-2">
								<div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
								<span className="text-muted-foreground text-sm">
									Uploading...
								</span>
							</div>
						)}
					</div>
				) : (
					<div className="flex flex-col items-center gap-2 text-center">
						<UploadCloudIcon className="text-muted-foreground h-10 w-10" />
						<div>
							<p className="text-sm font-medium">
								Drop a file here or click to upload
							</p>
							<p className="text-muted-foreground text-xs">
								JPG, PNG, GIF, WEBP up to {Math.round(maxSize / 1024 / 1024)}MB
							</p>
						</div>
					</div>
				)}
			</button>

			{preview && !isPending && (
				<div className="mt-2 flex justify-end">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={(e) => {
							e.stopPropagation();
							resetState();
						}}
					>
						<XIcon className="mr-1 h-3 w-3" />
						Remove
					</Button>
				</div>
			)}
		</div>
	);
}
