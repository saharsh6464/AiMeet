package com.saharsh.AiMeet.services;

import com.saharsh.AiMeet.Dto.UserDto;
import com.saharsh.AiMeet.models.Users;
import com.saharsh.AiMeet.repos.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class UserService {
    @Autowired
    private UserRepository repo;

    public Users saveUser(Users user1){
        return repo.save(user1);
    }

    public Users login(UserDto users) {
        Optional<Users> obj = repo.findByUsername(users.getUsername());
        if(obj.isPresent()){
            System.out.println("USER PRESENT");
            if(obj.get().getPassword().toLowerCase().equals(users.getPassword())){
                return obj.get();
            }else{
                return null;
            }
        }else{
            return null;
        }
    }
}
