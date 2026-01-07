package com.saharsh.AiMeet.repos;
import com.saharsh.AiMeet.models.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    List<Meeting> findByHost_Id(int hostId);
    List<Meeting> findBySubtopic_Id(Long subtopicId);
    List<Meeting> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);
}