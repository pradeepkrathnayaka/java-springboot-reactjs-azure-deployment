package com.rmpk.app.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rmpk.app.Priority;
import com.rmpk.app.TodoMapper;
import com.rmpk.app.dto.PagedResponse;
import com.rmpk.app.dto.TodoRequest;
import com.rmpk.app.dto.TodoResponse;
import com.rmpk.app.dto.TodoStatsResponse;
import com.rmpk.app.exception.ResourceNotFoundException;
import com.rmpk.app.repository.Todo;
import com.rmpk.app.repository.TodoRepository;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class TodoServiceImpl implements TodoService {

	private final TodoRepository todoRepository;
	private final TodoMapper todoMapper;

	@Override
	@Transactional
	public TodoResponse create(TodoRequest request) {
		log.debug("Creating todo: {}", request.title());
		Todo todo = todoMapper.toEntity(request);
		Todo saved = todoRepository.save(todo);
		log.info("Created todo with id: {}", saved.getId());
		return todoMapper.toResponse(saved);
	}

	@Override
	public PagedResponse<TodoResponse> getAll(Boolean completed, Priority priority, String search, Pageable pageable) {
		log.debug("Fetching todos - completed: {}, priority: {}, search: {}", completed, priority, search);

		Page<Todo> page = todoRepository.findAllWithFilters(completed, priority, search, pageable);

		var content = page.getContent().stream().map(todoMapper::toResponse).toList();

		return new PagedResponse<>(content, page.getNumber(), page.getSize(), page.getTotalElements(),
				page.getTotalPages(), page.isLast());
	}

	@Override
	public TodoResponse getById(Long id) {
		log.debug("Fetching todo by id: {}", id);
		return todoMapper.toResponse(findTodoOrThrow(id));
	}

	@Override
	@Transactional
	public TodoResponse update(Long id, TodoRequest request) {
		log.debug("Updating todo id: {}", id);
		Todo todo = findTodoOrThrow(id);
		todoMapper.updateEntity(todo, request);
		Todo updated = todoRepository.save(todo);
		log.info("Updated todo id: {}", id);
		return todoMapper.toResponse(updated);
	}

	@Override
	@Transactional
	public TodoResponse toggleComplete(Long id) {
		log.debug("Toggling completion for todo id: {}", id);
		Todo todo = findTodoOrThrow(id);
		todo.setCompleted(!todo.isCompleted());
		Todo updated = todoRepository.save(todo);
		log.info("Toggled todo id: {} to completed: {}", id, updated.isCompleted());
		return todoMapper.toResponse(updated);
	}

	@Override
	@Transactional
	public void delete(Long id) {
		log.debug("Deleting todo id: {}", id);
		Todo todo = findTodoOrThrow(id);
		todoRepository.delete(todo);
		log.info("Deleted todo id: {}", id);
	}

	@Override
	@Transactional
	public int deleteCompleted() {
		log.debug("Deleting all completed todos");
		int count = todoRepository.deleteAllCompleted();
		log.info("Deleted {} completed todos", count);
		return count;
	}

	@Override
	public TodoStatsResponse getStats() {
		log.debug("Fetching todo statistics");
		long total = todoRepository.count();
		long completed = todoRepository.countByCompleted(true);
		long pending = todoRepository.countByCompleted(false);
		long high = todoRepository.countByPriority(Priority.HIGH);
		long medium = todoRepository.countByPriority(Priority.MEDIUM);
		long low = todoRepository.countByPriority(Priority.LOW);

		return new TodoStatsResponse(total, completed, pending, high, medium, low);
	}

	private Todo findTodoOrThrow(Long id) {
		return todoRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
	}
}