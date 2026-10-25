package com.mmi404.portfolio.image;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

/**
 * Local-disk image storage (per docs/architecture.md — revisit if/when a photography
 * persona brings real image volume). Files are stored flat under {@code app.upload.dir}
 * and served back via the static resource handler at {@code /uploads/**} (see WebConfig).
 */
@Service
public class FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(FileStorageService.class);

    private final Path uploadDir;
    private final long maxSizeBytes;

    public FileStorageService(
            @Value("${app.upload.dir}") String uploadDir, @Value("${app.upload.max-size-bytes}") long maxSizeBytes) {
        this.uploadDir = Path.of(uploadDir).toAbsolutePath().normalize();
        this.maxSizeBytes = maxSizeBytes;
        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            throw new UncheckedIOException("Could not create upload directory: " + this.uploadDir, e);
        }
    }

    /** Validates, stores the file, and returns its public URL path (e.g. /uploads/&lt;uuid&gt;.jpg). */
    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No file provided");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only image uploads are allowed");
        }
        if (file.getSize() > maxSizeBytes) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "File exceeds the maximum allowed size of " + maxSizeBytes + " bytes");
        }

        String extension = extensionFor(contentType, file.getOriginalFilename());
        String filename = UUID.randomUUID() + extension;
        Path target = uploadDir.resolve(filename).normalize();
        if (!target.getParent().equals(uploadDir)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid file name");
        }

        try {
            file.transferTo(target);
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to store uploaded file", e);
        }

        return "/uploads/" + filename;
    }

    /** Best-effort delete of a previously stored file given its public URL path. Never throws. */
    public void deleteByUrl(String imageUrl) {
        if (imageUrl == null || !imageUrl.startsWith("/uploads/")) {
            return;
        }
        String filename = imageUrl.substring("/uploads/".length());
        try {
            Files.deleteIfExists(uploadDir.resolve(filename).normalize());
        } catch (IOException e) {
            log.warn("Failed to delete uploaded file for {}: {}", imageUrl, e.getMessage());
        }
    }

    private String extensionFor(String contentType, String originalFilename) {
        if (originalFilename != null && originalFilename.contains(".")) {
            String ext = originalFilename.substring(originalFilename.lastIndexOf('.'));
            if (ext.length() <= 10) {
                return ext;
            }
        }
        return switch (contentType) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> ".jpg";
        };
    }

    public Path getUploadDir() {
        return uploadDir;
    }
}
