package com.saharsh.AiMeet.controller;
import com.saharsh.AiMeet.Dto.UserDto;
import com.saharsh.AiMeet.models.Users;
import com.saharsh.AiMeet.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?>create(@RequestBody Users user1) {
        return ResponseEntity.ok(userService.saveUser(user1));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDto users){
        Users user =  userService.login(users);
        System.out.println("TESTING"+users.getPassword());
        if(user!=null){
            return ResponseEntity.ok(user);
        }else{
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials");
        }
    }

}

