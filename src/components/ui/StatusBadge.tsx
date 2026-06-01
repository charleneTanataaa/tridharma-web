type Props = {
    uploaded: boolean;
};

export default function StatusBadge({ uploaded, }: Props) {
  return uploaded ? (
    <span className=" text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
      SELESAI
    </span>
  ) : (
    <span className=" text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">
      PENDING
    </span>
  );
}
