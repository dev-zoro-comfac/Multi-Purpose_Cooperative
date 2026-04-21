import { merge } from "lodash";
import { Theme } from "@mui/material/styles";
import { Typography } from "./Typography";
import { Tabs } from "./Tabs";
import { Tab } from "./Tab";
import { OutlinedInput } from "./OutlinedInput";
import { ListItemIcon } from "./ListItemIcon";
import { Link } from "./Link";
import { LinearProgress } from "./LinearProgress";
import { InputLabel } from "./InputLabel";
import { IconButton } from "./IconButton";
import { CardContent } from "./CardContent";
import Badge from "./Badge";
import { Checkbox } from "./Checkbox";
import Button from "./Button";
import TableCell from "./TableCell";
import BaseButton from "./BaseButton";
import TextField from "./TextField";

export default function componentOverrides(theme: Theme) {
  return merge(
    BaseButton(),
    Button(theme),
    Badge(theme),
    CardContent(),
    Checkbox(theme),
    IconButton(theme),
    InputLabel(theme),
    LinearProgress(),
    Link(),
    ListItemIcon(),
    OutlinedInput(theme),
    Tab(theme),
    TableCell(theme),
    Tabs(),
    Typography(),
    TextField()
  );
}
