package com.jash.folder_structure_generator.repository;


import com.jash.folder_structure_generator.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUserName(String userName);

    User findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);


}
