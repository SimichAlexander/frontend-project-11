import onChange from 'on-change';

export default (elements, state, i18nextInstance) => {
  const renderPost = ({ id, title, link }) => {
    const liEl = document.createElement('li');
    liEl.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    const aEl = document.createElement('a');
    aEl.classList.add('fw-bold');
    aEl.setAttribute('href', link);
    aEl.setAttribute('target', '_blank');
    aEl.setAttribute('rel', 'noopener noreferrer');
    aEl.setAttribute('data-id', id);
    aEl.textContent = title;

    const btnEl = document.createElement('button');
    btnEl.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btnEl.setAttribute('type', 'button');
    btnEl.setAttribute('data-bs-toggle', 'modal');
    btnEl.setAttribute('data-bs-target', '#modal');
    btnEl.setAttribute('data-id', id);
    btnEl.textContent = i18nextInstance.t('viewing');
    liEl.append(aEl, btnEl);
    return liEl;
  };

  const renderFeed = (title, description) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3El = document.createElement('h3');
    h3El.classList.add('h6', 'm-0');
    h3El.textContent = title;
    const pEl = document.createElement('p');
    pEl.classList.add('m-0', 'small', 'text-black-50');
    pEl.textContent = description;
    liEl.append(h3El, pEl);
    return liEl;
  };

  const { form } = elements;
  const { input } = elements;
  const { feedback } = elements;
  const { feedsCardTitle } = elements;
  const { postsCardTitle } = elements;
  const { ulElFeeds } = elements;
  const { ulElPosts } = elements;

  const { modalTitle } = elements;
  const { modalBody } = elements;
  const { fullArticle } = elements;

  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.status') {
      if (value === 'valid') {
        form.reset();
        input.focus();
        input.classList.remove('is-invalid');

        feedback.classList.add('text-success');
        feedback.classList.remove('text-danger');

        feedsCardTitle.textContent = 'Фиды';
        postsCardTitle.textContent = 'Посты';
      } else {
        input.classList.add('is-invalid');
        feedback.classList.remove('text-success');
        feedback.classList.add('text-danger');
      }
    }
    if (path === 'form.message') {
      feedback.textContent = value;
    }
    if (path === 'feedList') {
      const feedItem = value[value.length - 1];
      const { title, description } = feedItem;
      ulElFeeds.prepend(renderFeed(title, description));
    }
    if (path === 'postList') {
      const postItem = value[value.length - 1];
      const { id, title, link } = postItem;
      ulElPosts.prepend(renderPost({ id, title, link }));
    }

    if (path === 'uiState.posts') {
      const id = value[value.length - 1];
      const aEl = document.querySelector(`a[data-id="${id}"]`);
      aEl.classList.remove('fw-bold');
      aEl.classList.add('fw-normal', 'link-secondary');
    }

    if (path === 'modalWindow.active') {
      const id = value;
      const post = state.postList.find((item) => item.id === id);
      modalTitle.textContent = post.title;
      modalBody.textContent = post.description;
      fullArticle.setAttribute('href', post.link);
    }
  });

  return watchedState;
};
