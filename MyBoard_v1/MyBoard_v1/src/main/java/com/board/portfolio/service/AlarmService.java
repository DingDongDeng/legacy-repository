package com.board.portfolio.service;

import com.board.portfolio.domain.entity.Account;
import com.board.portfolio.domain.entity.Alarm;
import com.board.portfolio.exception.custom.NotAllowAccessException;
import com.board.portfolio.exception.custom.NotFoundAlarmException;
import com.board.portfolio.repository.AlarmRepository;
import com.board.portfolio.security.account.AccountSecurityDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AlarmService {

    private AlarmRepository alarmRepository;
    private ModelMapper modelMapper;

    @Autowired
    public AlarmService(AlarmRepository alarmRepository,
                        ModelMapper modelMapper){
        this.alarmRepository = alarmRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional
    public Map getAlarmList(AccountSecurityDTO accountDTO) {
        Account account = modelMapper.map(accountDTO, Account.class);
        List<Alarm> alarmList = alarmRepository.findAllByTargetAccountOrderByRecieveDateDesc(account);

        Map data = new HashMap();
        data.put("alarmList", alarmList);
        return data;
    }

    @Transactional
    public void checkAlarm(String alarmId, AccountSecurityDTO accountDTO) {
        Alarm alarm = alarmRepository.findById(alarmId).orElseThrow(NotFoundAlarmException::new);
        if(!alarm.getTargetAccount().getEmail().equals(accountDTO.getEmail())) {
            throw new NotAllowAccessException();
        }
        alarm.setCheckDate(LocalDateTime.now());
    }

    @Transactional
    public void deleteAlarm(String alarmId, AccountSecurityDTO accountDTO) {
        Alarm alarm = alarmRepository.findById(alarmId).orElseThrow(NotFoundAlarmException::new);
        String targetEmail = alarm.getTargetAccount().getEmail();
        if(!targetEmail.equals(accountDTO.getEmail())) {
            throw new NotAllowAccessException();
        }
        alarmRepository.delete(alarm);
    }
}
