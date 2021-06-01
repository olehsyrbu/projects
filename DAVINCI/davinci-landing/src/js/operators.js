export default function operatorsPage() {
    $(document).on("click", ".play-btn", _popupFrameNode);
}

const _popupFrameNode = (e) => {
    let id = e.currentTarget.getAttribute('data-youtube-id');
    if (document.querySelector('.watch-video')) {
        document.querySelector('.watch-video').innerHTML = `<iframe id="ytiframe" src="//www.youtube-nocookie.com/embed/${id}?autoplay=1&amp;autohide=1&amp;controls=1&showinfo=0&rel=0" allowfullscreen="" width="100%" height="100%" frameborder="0"></iframe>`;
    }
};