package com.rmpk.app;


import org.springframework.stereotype.Component;

import com.rmpk.app.dto.TodoRequest;
import com.rmpk.app.dto.TodoResponse;
import com.rmpk.app.repository.Todo;

@Component
public class TodoMapper {

    public Todo toEntity(TodoRequest request) {
        return Todo.builder()
                .title(request.title())
                .description(request.description())
                .completed(request.completed())
                .priority(request.priority())
                .build();
    }

    public void updateEntity(Todo todo, TodoRequest request) {
        todo.setTitle(request.title());
        todo.setDescription(request.description());
        todo.setCompleted(request.completed());
        todo.setPriority(request.priority());
    }

    public TodoResponse toResponse(Todo todo) {
        return new TodoResponse(
                todo.getId(),
                todo.getTitle(),
                todo.getDescription(),
                todo.isCompleted(),
                todo.getPriority(),
                todo.getCreatedAt(),
                todo.getUpdatedAt()
        );
    }
}