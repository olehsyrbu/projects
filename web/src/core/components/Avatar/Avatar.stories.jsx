import { Avatar } from './Avatar';
import { LinkAvatar } from './LinkAvatar';

export default {
  title: 'Components/Avatar',
  component: Avatar,
};

export function Story() {
  return (
    <div className="flex items-center gap-4">
      <LinkAvatar
        url="https://picsum.photos/200/200"
        className="size-16"
        linkHref="https://picsum.photos/200/200"
      />
      <LinkAvatar
        url="https://picsum.photos/200/200"
        className="size-20"
        linkHref="https://picsum.photos/200/200"
      />
      <Avatar url="https://picsum.photos/200/200" />
      <Avatar className="size-16" />
      <Avatar className="size-20" />
      <Avatar />
    </div>
  );
}

Story.storyName = 'Avatar';
