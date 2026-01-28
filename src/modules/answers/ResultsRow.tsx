import { FC } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { IconButton } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

export type ResultData = {
  name: string | undefined;
  accuracy?: number;
  correctCount?: number;
  totalTrials?: number;
  length: number;
  rawDataDownload: () => void;
  csvDataDownload?: () => void;
  onDelete: () => void;
};

const ResultsRow: FC<ResultData> = ({
  name,
  accuracy,
  correctCount,
  totalTrials,
  length,
  rawDataDownload,
  csvDataDownload,
  onDelete,
}) => (
  <TableRow>
    <TableCell>{name}</TableCell>
    <TableCell>{accuracy?.toFixed(1)}%</TableCell>
    <TableCell>
      {correctCount}/{totalTrials}
    </TableCell>
    <TableCell>{length}</TableCell>
    <TableCell>
      <IconButton
        onClick={(): void => {
          rawDataDownload();
        }}
        title="Download as JSON"
      >
        <FileDownloadIcon />
      </IconButton>
      {csvDataDownload && (
        <IconButton
          onClick={(): void => {
            csvDataDownload();
          }}
          title="Download as CSV"
        >
          <FileDownloadIcon />
        </IconButton>
      )}
      <IconButton
        onClick={(): void => {
          if (
            // eslint-disable-next-line no-alert
            window.confirm(
              `Are you sure you want to delete results for ${name}?`,
            )
          ) {
            onDelete();
          }
        }}
        color="error"
      >
        <DeleteIcon />
      </IconButton>
    </TableCell>
  </TableRow>
);

export default ResultsRow;
