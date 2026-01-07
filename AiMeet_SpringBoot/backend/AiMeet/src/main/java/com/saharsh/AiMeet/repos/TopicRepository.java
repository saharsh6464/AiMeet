package com.saharsh.AiMeet.repos;
import com.saharsh.AiMeet.models.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    Optional<Topic> findByTopicAccessId(String topicAccessId);
    List<Topic> findAllBycreatedBy_Id(Long id);
}
