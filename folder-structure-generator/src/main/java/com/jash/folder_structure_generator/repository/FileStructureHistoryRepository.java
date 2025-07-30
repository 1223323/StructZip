package com.jash.folder_structure_generator.repository;

import com.jash.folder_structure_generator.model.FileStructureHistory;
import com.jash.folder_structure_generator.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileStructureHistoryRepository extends JpaRepository<FileStructureHistory, Long> {
    List<FileStructureHistory> findByUserOrderByCreatedAtDesc(User user);
}