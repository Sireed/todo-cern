package com.todo.controller;

import com.todo.entity.Todo;
import com.todo.repository.TodoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TodoController.class)
class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TodoRepository todoRepository;

    private Todo todo1;
    private Todo todo2;

    @BeforeEach
    void setUp() {
        todo1 = new Todo("Task 1", 1);
        todo1.setId(1L);
        
        todo2 = new Todo("Task 2", 2);
        todo2.setId(2L);
    }

    @Test
    void getAllTodos() throws Exception {
        List<Todo> todos = Arrays.asList(todo1, todo2);
        when(todoRepository.findAll()).thenReturn(todos);

        mockMvc.perform(get("/todos")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2));

        verify(todoRepository, times(1)).findAll();
    }

    @Test
    void deleteTodo() throws Exception {
        Long todoId = 1L;
        when(todoRepository.existsById(todoId)).thenReturn(true);
        doNothing().when(todoRepository).deleteById(todoId);

        mockMvc.perform(delete("/todos/{id}", todoId))
                .andExpect(status().isOk());

        verify(todoRepository, times(1)).existsById(todoId);
        verify(todoRepository, times(1)).deleteById(todoId);
    }

    @Test
    void deleteTodo_WhenIdDoesNotExist_ShouldReturnNotFound() throws Exception {
        Long todoId = 999L;
        when(todoRepository.existsById(todoId)).thenReturn(false);

        mockMvc.perform(delete("/todos/{id}", todoId))
                .andExpect(status().isNotFound());

        verify(todoRepository, times(1)).existsById(todoId);
        verify(todoRepository, never()).deleteById(anyLong());
    }
}

