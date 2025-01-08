import { Box, rem, Text } from '@mantine/core';


type DisplayValueProps = {
  value?: string | number;
  label: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const DisplayValue: React.FC<DisplayValueProps> = ({ value, label, ...props }) => {
  return (
    <Box {...props}>
      <Text fz={rem(10)} tt="uppercase" fw={700} c="dimmed">
        {label}
      </Text>
      <Text fz={rem(14)} fw={700}>
        {value}
      </Text>
    </Box>
  );
};