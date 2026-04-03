package com.rmpk.app.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.rmpk.app.Priority;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {

	// Search + filter with pagination
	@Query("""
			SELECT t FROM Todo t
			WHERE (:completed IS NULL OR t.completed = :completed)
			  AND (:priority IS NULL OR t.priority = :priority)
			  AND (:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%'))
			       OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))
			""")
	Page<Todo> findAllWithFilters(@Param("completed") Boolean completed, @Param("priority") Priority priority,
			@Param("search") String search, Pageable pageable);

	long countByCompleted(boolean completed);

	long countByPriority(Priority priority);

	@Modifying
	@Query("DELETE FROM Todo t WHERE t.completed = true")
	int deleteAllCompleted();
}