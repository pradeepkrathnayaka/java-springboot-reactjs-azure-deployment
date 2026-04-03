package com.rmpk.app.dto;

import com.rmpk.app.Priority;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TodoRequest(

		@NotBlank(message = "Title is required") @Size(min = 1, max = 200, message = "Title must be between 1 and 200 characters") String title,

		@Size(max = 1000, message = "Description must not exceed 1000 characters") String description,

		boolean completed,

		@NotNull(message = "Priority is required") Priority priority) {
}