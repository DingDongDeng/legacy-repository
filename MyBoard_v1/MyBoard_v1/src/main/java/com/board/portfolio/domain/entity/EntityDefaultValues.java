package com.board.portfolio.domain.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;

//TODO 좀 더 효율적으로 default 값을 설정 할 수 있도록 고민필요(동적 객체 생성, Class.class 등)
@MappedSuperclass
@NoArgsConstructor
@Getter
@Setter
public abstract class EntityDefaultValues {
    @PrePersist
    public void setDefaultValues(){};
}
