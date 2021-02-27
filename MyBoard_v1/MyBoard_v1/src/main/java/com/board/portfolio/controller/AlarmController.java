package com.board.portfolio.controller;

import com.board.portfolio.security.account.AccountSecurityDTO;
import com.board.portfolio.service.AlarmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AlarmController {

    private AlarmService alarmService;

    @Autowired
    public AlarmController(AlarmService alarmService){
        this.alarmService = alarmService;
    }

    @PreAuthorize("hasRole('ROLE_MEMBER')")
    @GetMapping("/alarm")
    public ResponseEntity getAlarmList(@ModelAttribute("accountDTO") AccountSecurityDTO accountDTO){
        return ResponseEntity.ok(alarmService.getAlarmList(accountDTO));
    }
    @PreAuthorize("hasRole('ROLE_MEMBER')")
    @PutMapping("/alarm/{alarmId}")
    public ResponseEntity checkAlarm(@PathVariable String alarmId,
                                     @ModelAttribute("accountDTO") AccountSecurityDTO accountDTO){
        alarmService.checkAlarm(alarmId, accountDTO);
        return ResponseEntity.ok(Result.SUCCESS);
    }
    @PreAuthorize("hasRole('ROLE_MEMBER')")
    @DeleteMapping("/alarm/{alarmId}")
    public ResponseEntity deleteAlarm(@PathVariable String alarmId,
                                      @ModelAttribute("accountDTO") AccountSecurityDTO accountDTO){
        alarmService.deleteAlarm(alarmId, accountDTO);
        return ResponseEntity.ok(Result.SUCCESS);
    }
}
