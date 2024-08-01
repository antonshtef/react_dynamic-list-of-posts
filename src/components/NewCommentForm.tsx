import React, { FormEvent, useState } from 'react';
import { addNewComment } from '../services/comment';
import classNames from 'classnames';
import { Comment, CommentData } from '../types/Comment';

type Props = {
  postId: number;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  setError: (value: boolean) => void;
};

export const NewCommentForm: React.FC<Props> = ({
  postId,
  setComments,
  setError,
}) => {
  const [newComment, setNewComment] = useState<CommentData>({
    name: '',
    email: '',
    body: '',
  });
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [bodyError, setBodyError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleOnChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    if (event.target.name === 'name') {
      setNewComment(prev => {
        return {
          ...prev,
          [event.target.name]: event.target.value,
        };
      });
      setNameError(false);
    }

    if (event.target.name === 'email') {
      setNewComment(prev => {
        return {
          ...prev,
          email: event.target.value,
        };
      });
      setEmailError(false);
    }

    if (event.target.name === 'body') {
      setNewComment(prev => {
        return {
          ...prev,
          body: event.target.value,
        };
      });
      setBodyError(false);
    }
  }

  const handleClearComment = () => {
    setNewComment({
      name: '',
      email: '',
      body: '',
    });
    setNameError(false);
    setEmailError(false);
    setBodyError(false);
  };

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const trimmedName = newComment.name.trim();
    const trimmedEmail = newComment.email.trim();
    const trimmedBody = newComment.body.trim();

    if (!trimmedName || !trimmedEmail || !trimmedBody) {
      if (!trimmedName) {
        setNameError(true);
      }

      if (!trimmedEmail) {
        setEmailError(true);
      }

      if (!trimmedBody) {
        setBodyError(true);
      }

      return;
    }

    setIsLoading(true);

    addNewComment({
      postId,
      name: newComment.name,
      email: newComment.email,
      body: newComment.body,
    })
      .then(comment =>
        setComments(currentComments => [...currentComments, comment]),
      )
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setIsLoading(false);
        setNewComment(prev => {
          return {
            ...prev,
            body: '',
          };
        });
      });
  }

  return (
    <form data-cy="NewCommentForm">
      <div className="field" data-cy="NameField">
        <label className="label" htmlFor="comment-author-name">
          Author Name
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="name"
            id="comment-author-name"
            placeholder="Name Surname"
            className={classNames('input', { 'is-danger': nameError })}
            value={newComment.name}
            onChange={handleOnChange}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-user" />
          </span>

          {nameError && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {nameError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Name is required
          </p>
        )}
      </div>

      <div className="field" data-cy="EmailField">
        <label className="label" htmlFor="comment-author-email">
          Author Email
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="email"
            id="comment-author-email"
            placeholder="email@test.com"
            className={classNames('input', { 'is-danger': emailError })}
            value={newComment.email}
            onChange={handleOnChange}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>

          {emailError && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {emailError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Email is required
          </p>
        )}
      </div>

      <div className="field" data-cy="BodyField">
        <label className="label" htmlFor="comment-body">
          Comment Text
        </label>

        <div className="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Type comment here"
            className={classNames('textarea', { 'is-danger': bodyError })}
            value={newComment.body}
            onChange={handleOnChange}
          />
        </div>

        {bodyError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Enter some text
          </p>
        )}
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={classNames('button is-link', {
              'is-loading': isLoading,
            })}
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>

        <div className="control">
          {/* eslint-disable-next-line react/button-has-type */}
          <button
            type="reset"
            className="button is-link is-light"
            onClick={handleClearComment}
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};
