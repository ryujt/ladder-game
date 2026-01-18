import React, { useState } from 'react';
import Button from '../ui/Button';
import { useToast } from '../../hooks/useToast';

const CopyIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const ShareIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ShareButton = ({
  url,
  title = '사다리 게임',
  text = '사다리 게임에 참여하세요!',
  onShare,
  onCopy,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const { success, error } = useToast();
  const canShare = typeof navigator !== 'undefined' && navigator.share;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      success('링크가 복사되었습니다');
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      error('복사에 실패했습니다');
    }
  };

  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share({ title, text, url });
        onShare?.();
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Button
      variant={copied ? 'success' : variant}
      size={size}
      fullWidth={fullWidth}
      onClick={handleShare}
      leftIcon={copied ? <CheckIcon /> : canShare ? <ShareIcon /> : <CopyIcon />}
      className={className}
    >
      {copied ? '복사 완료!' : canShare ? '공유하기' : '링크 복사'}
    </Button>
  );
};

export default ShareButton;
