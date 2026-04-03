package com.rmpk.app.dto;

import java.time.LocalDateTime;

import com.rmpk.app.Priority;

public record TodoResponse(Long id, String title, String description, boolean completed, Priority priority,
		LocalDateTime createdAt, LocalDateTime updatedAt) {
}