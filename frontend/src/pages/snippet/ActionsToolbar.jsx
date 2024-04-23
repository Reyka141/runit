import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { BoxArrowUp, Files, PlayFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { actions } from '../../slices';
import { useAuth, useRunButton, useSaveButton } from '../../hooks';
import 'react-toastify/dist/ReactToastify.css';

function ActionsToolbar({ snippet }) {
  const { t } = useTranslation();
  const { onClick, disabled } = useRunButton();
  const { saveCode } = useSaveButton();
  const dispatch = useDispatch();
  const { snippetData, code, isAllSaved } = snippet;
  const { name: snippetName, ownerUsername } = snippetData;
  const { isLoggedIn } = useAuth();

  const handleShare = () => {
    dispatch(
      actions.openModal({
        type: 'sharingSnippet',
        item: snippetData,
      }),
    );
  };

  const handleDuplicate = () => {
    if (isLoggedIn) {
      dispatch(
        actions.openModal({
          type: 'duplicateSnippet',
          item: {
            currSnippetName: snippetName,
            ownerUsername,
            code,
          },
        }),
      );
    } else {
      dispatch(
        actions.openModal({
          type: 'attemptDuplicateSnippet',
          item: {
            currSnippetName: snippetName,
            code,
          },
        }),
      );
    }
  };

  const handleSaveCode = () => {
    if (isAllSaved) {
      saveCode();
      toast.success(t('toasts.saveCode.success'));
      return;
    }
    toast.error(t('toasts.saveCode.error'));
  };

  return (
    <Col className="toolbar">
      <Button
        className="btn-icon-only-full-height"
        onClick={handleDuplicate}
        variant="nofill-body"
      >
        <Files />
      </Button>
      <Button
        className="btn-icon-only-full-height"
        onClick={handleShare}
        variant="nofill-body"
      >
        <BoxArrowUp />
        <span className="visually-hidden">{t('snippetActions.share')}</span>
      </Button>
      <Button
        className={`ms-3 btn-run${disabled ? ' running' : ''}`}
        disabled={disabled}
        onClick={onClick}
        variant="primary"
      >
        <PlayFill className="bi" />
        {t('snippetActions.run')}
      </Button>
      <Button
        className={`ms-3 btn-run${disabled ? ' running' : ''}`}
        disabled={!isAllSaved}
        onClick={handleSaveCode}
        variant="primary"
      >
        {t('snippetActions.save')}
      </Button>
    </Col>
  );
}

export default ActionsToolbar;
