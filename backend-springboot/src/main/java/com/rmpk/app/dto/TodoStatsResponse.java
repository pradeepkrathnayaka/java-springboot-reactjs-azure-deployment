package com.rmpk.app.dto;

public record TodoStatsResponse(long total, long completed, long pending, long highPriority, long mediumPriority,
		long lowPriority) {
}