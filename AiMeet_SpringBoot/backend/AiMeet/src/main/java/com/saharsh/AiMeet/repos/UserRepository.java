package com.saharsh.AiMeet.repos;


import com.saharsh.AiMeet.models.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<Users, Integer> {
    Optional<Users> findByName(String name);

    Optional<Users> findByUsername(String username);
}
