interface Props {
  date?: Date;
}

const DatePill: React.FC<Props> = ({ date = new Date() }) => {
  return (
    <span className="ml-auto rounded-lg border border-solid border-slate-300 bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-500">
      {new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }).format(date)}
    </span>
  );
};

export default DatePill;
