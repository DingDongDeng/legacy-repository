package com.board.portfolio.store.repository;

import com.board.portfolio.domain.entity.Board;
import com.board.portfolio.domain.entity.BoardDetail;
import com.board.portfolio.exception.store.NotFoundStoredEntityException;
import com.board.portfolio.repository.BoardDetailRepository;
import com.board.portfolio.repository.BoardRepository;
import com.board.portfolio.store.manager.StoreManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Component
public class StoredBoardRepository extends StoredRepository<BoardDetail> {

    private final BoardRepository boardRepository;
    private final BoardDetailRepository boardDetailRepository;

    @Autowired
    public StoredBoardRepository(BoardRepository boardRepository,
                                 BoardDetailRepository boardDetailRepository,
                                 StoreManager sm) {
        super("board",sm);
        this.boardRepository = boardRepository;
        this.boardDetailRepository = boardDetailRepository;
    }

    public List<Board> getBoardList(int page, long startNum, int pageSize){
        if(page<=storedSize()/pageSize){
            return (List<Board>)getList(startNum,pageSize,o->o.transToBoard());
        }
        return boardRepository.getBoardList(startNum, pageSize);
    }

    public void increaseView(Long id) {
        findByIdFromStore(id).ifPresent(o->o.increaseView());
    }

    public void updatePost(Long id, String title, String content, LocalDateTime update){
        findByIdFromStore(id).ifPresent(o->{
            o.setTitle(title);
            o.setContent(content);
            o.setUpDate(update);
        });
    }
    public void decreaseLike(Long id){
        findByIdFromStore(id).ifPresent(o->o.decreaseLike());
    }
    public void increaseLike(Long id){
        findByIdFromStore(id).ifPresent(o->o.increaseLike());
    }

    public Optional<BoardDetail> findById(Long id){
        try{
            return Optional.of(
                    boardDetailRepository
                            .save(findByIdFromStore(id).orElseThrow(NotFoundStoredEntityException::new)));
        }
        catch (NotFoundStoredEntityException ex){
            return boardDetailRepository.findById(id);
        }

    }

    @Override
    public BoardDetail save(BoardDetail entity) {
        BoardDetail boardDetail = boardDetailRepository.save(entity);
        saveStore(entity);
        return boardDetail;
    }

    @Override
    public void delete(BoardDetail entity) {
        boardDetailRepository.delete(entity);
        deleteStore(entity);
    }

}
