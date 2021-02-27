package com.board.portfolio.domain.entity;

import com.board.portfolio.store.repository.StoredBoardRepository;
import com.board.portfolio.store.repository.StoredEntityIdentifier;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Optional;

@MappedSuperclass
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public abstract class BoardCore extends EntityDefaultValues implements StoredEntityIdentifier<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="BOARD_ID")
    private Long boardId;

    @Column(name = "TITLE")
    private String title;

    @Column(name="LIKE_")
    private Integer like;

    @Column(name="VIEW")
    private Integer view;

    @Column(name = "REG_DATE")
    @CreatedDate
    private LocalDateTime regDate;

    @Column(name = "UP_DATE")
    private LocalDateTime upDate;

    @ManyToOne
    @JoinColumn(name="EMAIL")
    @JsonManagedReference
    private Account account;


    public BoardCore(Long boardId) {
        this.boardId = boardId;
    }

    public void increaseLike(){
        this.like++;
    }
    public void increaseLike(StoredBoardRepository storedBoardRepository){
        this.like++;
        storedBoardRepository.increaseLike(this.boardId);
    }
    public void decreaseLike(){
        this.like--;
    }
    public void decreaseLike(StoredBoardRepository storedBoardRepository){
        this.like--;
        storedBoardRepository.decreaseLike(this.boardId);
    }
    public void increaseView(){
        this.view++;
    }
    public void increaseView(StoredBoardRepository storedBoardRepository){
        this.view++;
        storedBoardRepository.increaseView(this.boardId);
    }

    public void updatePost(String title, LocalDateTime upDate){
        this.title = title;
        this.upDate = upDate;
    }

    @Override
    public void setDefaultValues() {
        this.like = Optional.ofNullable(this.like).orElse(0);
        this.view = Optional.ofNullable(this.view).orElse(0);
    }
}
