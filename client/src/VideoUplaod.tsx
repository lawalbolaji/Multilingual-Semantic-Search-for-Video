import { Stack, Button, IconButton } from "@mui/material";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

type fileUploadProps = {
  onFileLoad: (file?: File) => void;
};

export default function FileUpload({ onFileLoad }: fileUploadProps) {
  return (
    <>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Button variant="contained" component="label">
          Upload
          <input
            hidden
            accept="video/*"
            type="file"
            onChange={(e: React.SyntheticEvent<HTMLInputElement>) =>
              onFileLoad(e.currentTarget.files?.[0])
            }
          />
        </Button>
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="label"
        >
          <input hidden accept="image/*" type="file" />
          <VideoLibraryIcon />
        </IconButton>
      </Stack>
    </>
  );
}
