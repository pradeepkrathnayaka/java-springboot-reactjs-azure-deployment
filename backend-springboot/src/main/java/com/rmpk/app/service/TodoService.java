package com.rmpk.app.service;

import org.springframework.data.domain.Pageable;

import com.rmpk.app.Priority;
import com.rmpk.app.dto.PagedResponse;
import com.rmpk.app.dto.TodoRequest;
import com.rmpk.app.dto.TodoResponse;
import com.rmpk.app.dto.TodoStatsResponse;

public interface TodoService {

	TodoResponse create(TodoRequest request);

	PagedResponse<TodoResponse> getAll(Boolean completed, Priority priority, String search, Pageable pageable);

	TodoResponse getById(Long id);

	TodoResponse update(Long id, TodoRequest request);

	TodoResponse toggleComplete(Long id);

	void delete(Long id);

	int deleteCompleted();

	TodoStatsResponse getStats();
}