package com.board.portfolio.service;

import com.board.portfolio.domain.dto.BoardDTO;
import com.board.portfolio.domain.entity.*;
import com.board.portfolio.exception.custom.FailSaveFileException;
import com.board.portfolio.exception.custom.NotAllowAccessException;
import com.board.portfolio.exception.custom.NotFoundFileException;
import com.board.portfolio.exception.custom.NotFoundPostException;
import com.board.portfolio.paging.BoardPagination;
import com.board.portfolio.paging.PagingResult;
import com.board.portfolio.paging.SearchBoardPagination;
import com.board.portfolio.repository.BoardDetailRepository;
import com.board.portfolio.repository.BoardRepository;
import com.board.portfolio.repository.FileAttachmentRepository;
import com.board.portfolio.repository.LikeBoardRepository;
import com.board.portfolio.security.account.AccountSecurityDTO;
import com.board.portfolio.store.repository.StoredBoardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.board.portfolio.util.StaticUtils.modelMapper;

@Slf4j
@Service
@RequiredArgsConstructor
public class BoardService {

    private final FileService fileService;

    private final BoardRepository boardRepository;
    private final BoardDetailRepository boardDetailRepository;
    private final LikeBoardRepository likeBoardRepository;
    private final FileAttachmentRepository fileAttachmentRepository;
    private final BoardPagination boardPagination;
    private final SearchBoardPagination searchBoardPagination;
    private final StoredBoardRepository storedBoardRepository;

    @Transactional
    public PagingResult<Board> getPaginBoardList(int page){
        return boardPagination.getPagingResult(page);
    }

    @Transactional
    public PagingResult<Board> getPaginSearchBoardList(int page, BoardDTO.Search dto){
        return searchBoardPagination.getPagingResult(page,dto);
    }

    @Transactional
    public void writePost(BoardDTO.Write boardDTO, AccountSecurityDTO accountDTO) {
        String transContent = fileService.transImgSrc(boardDTO.getContent());
        boardDTO.setContent(transContent);

        BoardDetail board = modelMapper.map(boardDTO, BoardDetail.class);
        Account account = modelMapper.map(accountDTO, Account.class);
        board.setAccount(account);
        board = storedBoardRepository.save(board);
        try {
            if(!boardDTO.isNullFileList()){
                fileService.saveFileAttachment(board, boardDTO.getFileList(), account);
            }
        }
        catch (IOException e){
            log.error("IOException",e);
            throw new FailSaveFileException();
        }

    }

    @Transactional
    public Map readPost(long boardId, AccountSecurityDTO accountDTO) {
        BoardDetail boardDetail = boardDetailRepository.findById(boardId).orElseThrow(NotFoundPostException::new);
        List<FileAttachment> fileAttachmentList = fileService.getFileAttachment(boardId, boardDetail);
        boardDetail.increaseView(storedBoardRepository);

        Map data = new HashMap<String,Object>();
        data.put("post",boardDetail);
        data.put("fileList", fileAttachmentList);

        boolean isLikedPost = isLikedPost(boardId, accountDTO.getEmail());
        data.put("isLikedPost",isLikedPost);

        return data;
    }
    private boolean isLikedPost(Long boardId, String email){
        if(email==null){
            return false;
        }
        return likeBoardRepository.findByBoardAndAccount(new Board(boardId),new Account(email)).isPresent();

    }


    @Transactional
    public Map likePost(BoardDTO.Like dto, AccountSecurityDTO accountDTO) {
        Board board = boardRepository.findById(dto.getBoardId()).orElseThrow(NotFoundPostException::new);
        Account account = modelMapper.map(accountDTO, Account.class);

        Optional<LikeBoard> opLikeBoard =  likeBoardRepository.findByBoardAndAccount(board,account);

        if(opLikeBoard.isPresent()){//이미 "좋아요"를 누름
            likeBoardRepository.delete(opLikeBoard.get());
            board.decreaseLike(storedBoardRepository);
        }
        else{
            likeBoardRepository.save(new LikeBoard(board,account));
            board.increaseLike(storedBoardRepository);
        }

        Map data = new HashMap<String,Object>();
        data.put("like",board.getLike());
        return data;

    }

    @Transactional
    public void download(HttpServletResponse res, String fileId) {
        FileAttachment file = fileAttachmentRepository.findById(fileId).orElseThrow(NotFoundFileException::new);
        fileService.download(res,file);
    }

    @CacheEvict(value = "fileList", key = "#boardId")
    @Transactional
    public void deletePost(long boardId, AccountSecurityDTO accountDTO) {

        BoardDetail board = boardDetailRepository.findById(boardId).orElseThrow(NotFoundPostException::new);
        if(!board.getAccount().getEmail().equals(accountDTO.getEmail())){
            throw new NotAllowAccessException();
        }
        fileService.updateStoreImgFolder(board.getContent(),"");

        List<FileAttachment> fileAttachmentList = board.getFileAttachmentList();
        fileService.deleteStoreAttachFilePhysic(fileAttachmentList);
        storedBoardRepository.delete(board);
    }

    @Transactional
    public void updatePost(Long boardId, BoardDTO.Update dto, AccountSecurityDTO accountDTO) {
        String transContent = fileService.transImgSrc(dto.getContent());
        dto.setContent(transContent);
        Account account = modelMapper.map(accountDTO, Account.class);
        BoardDetail board = storedBoardRepository.findById(boardId).orElseThrow(NotFoundPostException::new);
        fileService.updateStoreImgFolder(board.getContent(),dto.getContent());
        if(!board.getAccount().getEmail().equals(accountDTO.getEmail())){
            throw new NotAllowAccessException();
        }

        board.updatePost(dto.getTitle(),
                dto.getContent(),
                LocalDateTime.now(),
                storedBoardRepository);

        fileService.updateFileList(board.getFileAttachmentList(),dto,boardId,account);

    }
}
