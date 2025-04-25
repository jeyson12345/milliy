import './content_top.scss';

interface Props {
  title?: string;
  children?: React.ReactNode;
}

function ContentTop({ title, children }: Props) {
  return (
    <div className="content_top">
      {!!title && <h2>{title}</h2>}
      {!!children && <div className="content_top-children">{children}</div>}
    </div>
  );
}

export default ContentTop;
