package com.example.labkursSpring.controller;

import com.example.labkursSpring.model.Player;
import com.example.labkursSpring.model.Team;
import com.example.labkursSpring.repository.PlayerRepo;
import com.example.labkursSpring.repository.TeamRepo;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/player")
public class PlayerController {

    private final PlayerRepo playerRepo;
    private final TeamRepo teamRepo;

    public PlayerController( PlayerRepo playerRepo, TeamRepo teamRepo){
        this.playerRepo=playerRepo;
        this.teamRepo=teamRepo;
    }
    
    @GetMapping
    public List<Player> getAll() {
        return playerRepo.findAll();
    }

    @GetMapping("/byTeam/{TeamID}")
    public List<Player> byTeam(@PathVariable Long TeamID){
        return playerRepo.findByTeam_teamID(TeamID);
    }

    @PostMapping
    public Player create(@RequestBody Map<String, Object> body){
        String name = (String) body.get("Name");
        Long number = toLong(body.get("Number"));
        Long birthYear = toLong(body.get("BirthYear"));
        Long teamId = toLong(body.get("TeamID"));
        Player p = new Player();
        p.setName(name);
        p.setNumber(number);
        p.setBirthYear(birthYear);
        if(teamId != null){
            teamRepo.findById(teamId).ifPresent(p::setTeam);
        }
        return playerRepo.save(p);
    }

    @PutMapping("/{id}")
    public Player update(@PathVariable Long id, @RequestBody Map<String, Object> body){
        return playerRepo.findById(id).map(existing -> {
            if(body.containsKey("Name")) {
                existing.setName((String) body.get("Name"));
            }
            if(body.containsKey("Number")) {
                existing.setNumber(toLong(body.get("Number")));
            }
            if(body.containsKey("BirthYear")) {
                existing.setBirthYear(toLong(body.get("BirthYear")));
            }
            if(body.containsKey("TeamID")) {
                Long teamId = toLong(body.get("TeamID"));
                if(teamId == null) {
                    existing.setTeam(null);
                } else {
                    teamRepo.findById(teamId).ifPresent(existing::setTeam);
                }
            }
            return  playerRepo.save(existing);
        }).orElseGet(() -> {
            Player p = new Player();
            p.setPlayerID(id);
            p.setName((String) body.get("Name"));
            p.setNumber(toLong(body.get("Number")));
            p.setBirthYear(toLong(body.get("BirthYear")));
            Long teamId = toLong(body.get("TeamID"));
            if(teamId != null) teamRepo.findById(teamId).ifPresent(p::setTeam);
            return playerRepo.save(p);
        });
    
    }
    @DeleteMapping("/{id}")
    public void Delete(@PathVariable Long id){
        playerRepo.findById(id).ifPresent(playerRepo::delete);
    }

    private Long toLong(Object val){
        if(val == null) return null;
        if(val instanceof Number) return ((Number) val).longValue();
        try {
            return Long.parseLong(val.toString());
        } catch(Exception e){
            return null;
        }
    }
}
