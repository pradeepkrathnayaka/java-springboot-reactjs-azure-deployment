package com.rmpk.app.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.rmpk.app.Priority;
import com.rmpk.app.dto.PagedResponse;
import com.rmpk.app.dto.TodoRequest;
import com.rmpk.app.dto.TodoResponse;
import com.rmpk.app.dto.TodoStatsResponse;
import com.rmpk.app.service.TodoService;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/todos")
@RequiredArgsConstructor
public class TodoController {

	private final TodoService todoService;

	// POST /api/v1/todos
	@PostMapping
	public ResponseEntity<TodoResponse> create(@Valid @RequestBody TodoRequest request) {
		TodoResponse created = todoService.create(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(created);
	}

	// GET
	// /api/v1/todos?completed=false&priority=HIGH&search=spring&page=0&size=10&sortBy=createdAt&direction=desc
	@GetMapping
	public ResponseEntity<PagedResponse<TodoResponse>> getAll(@RequestParam(required = false) Boolean completed,
			@RequestParam(required = false) Priority priority, @RequestParam(required = false) String search,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "createdAt") String sortBy,
			@RequestParam(defaultValue = "desc") String direction) {
		Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
		Pageable pageable = PageRequest.of(page, size, sort);
		return ResponseEntity.ok(todoService.getAll(completed, priority, search, pageable));
	}

	// GET /api/v1/todos/{id}
	@GetMapping("/{id}")
	public ResponseEntity<TodoResponse> getById(@PathVariable Long id) {
		return ResponseEntity.ok(todoService.getById(id));
	}

	// PUT /api/v1/todos/{id}
	@PutMapping("/{id}")
	public ResponseEntity<TodoResponse> update(@PathVariable Long id, @Valid @RequestBody TodoRequest request) {
		return ResponseEntity.ok(todoService.update(id, request));
	}

	// PATCH /api/v1/todos/{id}/toggle
	@PatchMapping("/{id}/toggle")
	public ResponseEntity<TodoResponse> toggleComplete(@PathVariable Long id) {
		return ResponseEntity.ok(todoService.toggleComplete(id));
	}

	// DELETE /api/v1/todos/{id}
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		todoService.delete(id);
		return ResponseEntity.noContent().build();
	}

	// DELETE /api/v1/todos/completed
	@DeleteMapping("/completed")
	public ResponseEntity<Map<String, Integer>> deleteCompleted() {
		int count = todoService.deleteCompleted();
		return ResponseEntity.ok(Map.of("deletedCount", count));
	}

	// GET /api/v1/todos/stats
	@GetMapping("/stats")
	public ResponseEntity<TodoStatsResponse> getStats() {
		return ResponseEntity.ok(todoService.getStats());
	}
}