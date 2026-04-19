import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { shadcnComponentDefinitions } from "@/components/catalog/shadcn/catalog";
import { calendarAgendaDefinition } from "@/components/catalog/calendar-agenda";
import { calendarEventDefinition } from "@/components/catalog/calendar-event";
import { chatDefinition } from "@/components/catalog/chat";
import { iconDefinition } from "@/components/catalog/icon";
import {
  bulletListDefinition,
  numberedListDefinition,
} from "@/components/catalog/lists";
import { tweetDefinition } from "@/components/catalog/tweet";
import { todoListDefinition } from "@/components/catalog/todo-list";

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
    Text: shadcnComponentDefinitions.Text,
    CalendarAgenda: calendarAgendaDefinition,
    CalendarEvent: calendarEventDefinition,
    Chat: chatDefinition,
    Icon: iconDefinition,
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
    Tweet: tweetDefinition,
    TodoList: todoListDefinition,
  },
  actions: {},
});
