package com.saharsh.AiMeet.repos;


import com.saharsh.AiMeet.models.Subtopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface SubtopicRepository extends JpaRepository<Subtopic, Long> {
    List<Subtopic> findByParentTopic_Id(Long topicId);
    List<Subtopic> findByNameContainingIgnoreCase(String name);
}