import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    generateLadder,
    joinLadder,
    getLadderResult
} from '../api/ladderApi';

const useLadderStore = create(
    persist(
        (set) => ({
            ladderId: null,
            participants: 0,
            participants_joined: [],
            result: null,
            error: null,

            createLadder: async (maxParticipants, resultItems) => {
                try {
                    set({ error: null });

                    const response = await generateLadder(maxParticipants, resultItems);

                    const ladderId = response.id || response.ladderId;

                    if (!ladderId) {
                      throw new Error('사다리 ID를 찾을 수 없습니다');
                    }

                    set({
                        ladderId,
                        participants: maxParticipants,
                        participants_joined: [],
                        result: null,
                        resultItems: response.resultItems || Array(maxParticipants).fill('꽝')
                    });

                    return ladderId;
                } catch (error) {
                    set({ error: error.message || '사다리 생성 중 오류가 발생했습니다' });
                    throw error;
                }
            },

            joinLadderGame: async (ladderId, name, position) => {
                try {
                    set({ error: null });

                    const response = await joinLadder(ladderId, name, position);

                    const participants = response.participants || [];
                    const isComplete = response.isComplete || false;

                    set({
                        ladderId,
                        participants_joined: participants
                    });

                    return { success: true, participants, isComplete };
                } catch (error) {
                    set({ error: error.message || '사다리 참가 중 오류가 발생했습니다' });
                    throw error;
                }
            },

            checkResult: async (ladderId) => {
                try {
                    set({ error: null });

                    const response = await getLadderResult(ladderId);

                    const isComplete = response.isComplete || false;
                    const results = response.results || null;
                    const participants = response.participants || [];
                    const maxParticipants = response.maxParticipants || 0;

                    if (isComplete && results) {
                        set({
                            result: results,
                            participants_joined: participants,
                            participants: maxParticipants
                        });
                    } else {
                        set({
                            participants_joined: participants,
                            participants: maxParticipants
                        });
                    }

                    return {
                        success: true,
                        isComplete,
                        data: results,
                        participants,
                        maxParticipants
                    };
                } catch (error) {
                    set({ error: error.message || '결과 확인 중 오류가 발생했습니다' });
                    throw error;
                }
            },

            resetState: () => {
                set({
                    ladderId: null,
                    participants: 0,
                    participants_joined: [],
                    result: null,
                    error: null
                });
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
