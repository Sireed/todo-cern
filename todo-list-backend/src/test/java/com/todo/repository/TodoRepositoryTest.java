package com.todo.repository;

import com.todo.entity.Todo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@TestPropertySource(properties = {
    "spring.datasource.initialization-mode=never"
})
class TodoRepositoryTest {

    @Autowired
    private TodoRepository todoRepository;

    @Test
    void save() {
        Todo todo = new Todo("Task 1", 1);
        Todo savedTodo = todoRepository.save(todo);

        assertThat(savedTodo.getId()).isNotNull();
        assertThat(savedTodo.getTask()).isEqualTo("Task 1");
    }

    @Test
    @Sql(statements = "DELETE FROM todo")
    void findAll() {
        Todo todo1 = new Todo("Task 1", 1);
        Todo todo2 = new Todo("Task 2", 2);
        todoRepository.save(todo1);
        todoRepository.save(todo2);

        List<Todo> todos = todoRepository.findAll();

        assertThat(todos).hasSize(2);
    }

    @Test
    void deleteById() {
        Todo todo = new Todo("Task 1", 1);
        Todo savedTodo = todoRepository.save(todo);
        Long id = savedTodo.getId();

        todoRepository.deleteById(id);

        assertThat(todoRepository.findById(id)).isEmpty();
    }
}

