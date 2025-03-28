import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
    generateLadder, 
    joinLadder, 
    getLadderResult 
} from '../api/ladderApi';

const useLadderStore = create(
    persist(
        (set, get) => ({
            ladderId: null,
            participants: 0,
            participants_joined: [],
            result: null,
            error: null,

            // 사다리 생성
            createLadder: async (maxParticipants) => {
                try {
                    set({ error: null });
                    console.log('사다리 생성 요청 전:', { maxParticipants });
                    
                    const response = await generateLadder(maxParticipants);
                    console.log('사다리 생성 응답:', response);
                    
                    // API 응답 구조 확인 및 디버깅
                    console.log('응답 타입:', typeof response);
                    console.log('응답 키:', Object.keys(response));
                    
                    // 필드 추출 (response.id 또는 response.ladderId 확인)
                    const ladderId = response.id || response.ladderId;
                    console.log('추출된 ladderId:', ladderId);
                    
                    if (!ladderId) {
                      console.error('응답에서 ID를 찾을 수 없음:', response);
                      throw new Error('사다리 ID를 찾을 수 없습니다');
                    }
                    
                    set({ 
                        ladderId, 
                        participants: maxParticipants,
                        participants_joined: [],
                        result: null
                    });
                    
                    console.log('상태 업데이트 후:', { ladderId, maxParticipants });
                    return { ladderId };
                } catch (error) {
                    console.error('사다리 생성 에러 (스토어):', error);
                    set({ error: error.message || '사다리 생성 중 오류가 발생했습니다' });
                    throw error;
                }
            },

            // 사다리 참가
            joinLadderGame: async (ladderId, name, position) => {
                try {
                    set({ error: null });
                    console.log('사다리 참가 요청 전 (스토어):', { ladderId, name, position });
                    
                    const response = await joinLadder(ladderId, name, position);
                    console.log('사다리 참가 응답 (스토어):', response);
                    
                    // 응답 데이터 확인
                    const participants = response.participants || [];
                    const isComplete = response.isComplete || false;
                    
                    // 상태 업데이트
                    set({ 
                        ladderId,
                        participants_joined: participants
                    });
                    
                    console.log('참가 상태 업데이트 후:', { ladderId, participants });
                    return { success: true, participants, isComplete };
                } catch (error) {
                    console.error('사다리 참가 에러 (스토어):', error);
                    set({ error: error.message || '사다리 참가 중 오류가 발생했습니다' });
                    throw error;
                }
            },

            // 사다리 결과 확인
            checkResult: async (ladderId) => {
                try {
                    set({ error: null });
                    console.log('결과 확인 요청 전 (스토어):', { ladderId });
                    
                    const response = await getLadderResult(ladderId);
                    console.log('사다리 결과 응답 (스토어):', response);
                    
                    // 결과 데이터 확인
                    const isComplete = response.isComplete || false;
                    const results = response.results || null;
                    const participants = response.participants || [];
                    
                    // 결과 데이터 설정
                    if (isComplete && results) {
                        set({ 
                            result: results,
                            participants_joined: participants
                        });
                        console.log('완료된 결과 업데이트:', results);
                    } else {
                        set({ participants_joined: participants });
                        console.log('진행 중 상태 업데이트:', { participants });
                    }
                    
                    return { 
                        success: true, 
                        isComplete,
                        data: results,
                        participants
                    };
                } catch (error) {
                    console.error('결과 확인 에러 (스토어):', error);
                    set({ error: error.message || '결과 확인 중 오류가 발생했습니다' });
                    throw error;
                }
            },

            // 상태 초기화
            resetState: () => {
                set({ 
                    ladderId: null,
                    participants: 0,
                    participants_joined: [],
                    result: null,
                    error: null
                });
                console.log('상태 초기화 완료');
            }
        }),
        {
            name: 'ladder-storage',
            partialize: (state) => ({
                ladderId: state.ladderId,
                participants: state.participants
            })
        }
    )
);

export default useLadderStore; 