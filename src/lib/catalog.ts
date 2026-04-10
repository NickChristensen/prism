import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { shadcnComponentDefinitions } from "@json-render/shadcn/catalog";
import { calendarAgendaDefinition } from "@/components/catalog/calendar-agenda";
import { calendarEventDefinition } from "@/components/catalog/calendar-event";
import { iconDefinition } from "@/components/catalog/icon";
import {
  bulletListDefinition,
  numberedListDefinition,
} from "@/components/catalog/lists";
import { textDefinition } from "@/components/catalog/text";
import { todoListDefinition } from "@/components/catalog/todo-list";
import {
  inlineBoldDefinition,
  inlineCodeDefinition,
  inlineHighlightDefinition,
  inlineItalicDefinition,
  inlineLinkDefinition,
  inlineStrikethroughDefinition,
  inlineTextDefinition,
} from "@/components/catalog/text-inline";

export const catalog = defineCatalog(schema, {
  components: {
    Card: shadcnComponentDefinitions.Card,
    Stack: shadcnComponentDefinitions.Stack,
    Grid: shadcnComponentDefinitions.Grid,
    Separator: shadcnComponentDefinitions.Separator,
    Tabs: shadcnComponentDefinitions.Tabs,
    Accordion: shadcnComponentDefinitions.Accordion,
    Collapsible: shadcnComponentDefinitions.Collapsible,
    Dialog: shadcnComponentDefinitions.Dialog,
    Drawer: shadcnComponentDefinitions.Drawer,
    Carousel: shadcnComponentDefinitions.Carousel,
    Table: shadcnComponentDefinitions.Table,
    Heading: shadcnComponentDefinitions.Heading,
    Text: textDefinition,
    CalendarAgenda: calendarAgendaDefinition,
    CalendarEvent: calendarEventDefinition,
    Icon: iconDefinition,
    InlineText: inlineTextDefinition,
    InlineBold: inlineBoldDefinition,
    InlineItalic: inlineItalicDefinition,
    InlineCode: inlineCodeDefinition,
    InlineHighlight: inlineHighlightDefinition,
    InlineStrikethrough: inlineStrikethroughDefinition,
    InlineLink: inlineLinkDefinition,
    Image: shadcnComponentDefinitions.Image,
    Avatar: shadcnComponentDefinitions.Avatar,
    Badge: shadcnComponentDefinitions.Badge,
    Alert: shadcnComponentDefinitions.Alert,
    Progress: shadcnComponentDefinitions.Progress,
    Skeleton: shadcnComponentDefinitions.Skeleton,
    Spinner: shadcnComponentDefinitions.Spinner,
    Tooltip: shadcnComponentDefinitions.Tooltip,
    Popover: shadcnComponentDefinitions.Popover,
    Input: shadcnComponentDefinitions.Input,
    Textarea: shadcnComponentDefinitions.Textarea,
    Select: shadcnComponentDefinitions.Select,
    Checkbox: shadcnComponentDefinitions.Checkbox,
    Radio: shadcnComponentDefinitions.Radio,
    Switch: shadcnComponentDefinitions.Switch,
    Slider: shadcnComponentDefinitions.Slider,
    Button: shadcnComponentDefinitions.Button,
    Link: shadcnComponentDefinitions.Link,
    DropdownMenu: shadcnComponentDefinitions.DropdownMenu,
    Toggle: shadcnComponentDefinitions.Toggle,
    ToggleGroup: shadcnComponentDefinitions.ToggleGroup,
    ButtonGroup: shadcnComponentDefinitions.ButtonGroup,
    Pagination: shadcnComponentDefinitions.Pagination,
    BulletList: bulletListDefinition,
    NumberedList: numberedListDefinition,
    TodoList: todoListDefinition,
  },
  actions: {},
});
