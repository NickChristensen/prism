import { defineRegistry } from "@json-render/react";
import { shadcnComponents } from "@/components/catalog/shadcn/components";
import { Calendar } from "@/components/catalog/calendar";
import { Chat } from "@/components/catalog/chat";
import { Icon } from "@/components/catalog/icon-client";
import { BulletList, NumberedList } from "@/components/catalog/lists";
import { Tweet } from "@/components/catalog/tweet";
import { TodoList } from "@/components/catalog/todo-list";
import { catalog } from "@/lib/catalog";

export const { registry, handlers, executeAction } = defineRegistry(catalog, {
  components: {
    Card: shadcnComponents.Card,
    Stack: shadcnComponents.Stack,
    Grid: shadcnComponents.Grid,
    Separator: shadcnComponents.Separator,
    Tabs: shadcnComponents.Tabs,
    Accordion: shadcnComponents.Accordion,
    Collapsible: shadcnComponents.Collapsible,
    Dialog: shadcnComponents.Dialog,
    Drawer: shadcnComponents.Drawer,
    Carousel: shadcnComponents.Carousel,
    Table: shadcnComponents.Table,
    Heading: shadcnComponents.Heading,
    Text: shadcnComponents.Text,
    Calendar,
    Chat,
    Icon,
    Image: shadcnComponents.Image,
    Avatar: shadcnComponents.Avatar,
    Badge: shadcnComponents.Badge,
    Alert: shadcnComponents.Alert,
    Progress: shadcnComponents.Progress,
    Skeleton: shadcnComponents.Skeleton,
    Spinner: shadcnComponents.Spinner,
    Tooltip: shadcnComponents.Tooltip,
    Popover: shadcnComponents.Popover,
    Input: shadcnComponents.Input,
    Textarea: shadcnComponents.Textarea,
    Select: shadcnComponents.Select,
    Checkbox: shadcnComponents.Checkbox,
    Radio: shadcnComponents.Radio,
    Switch: shadcnComponents.Switch,
    Slider: shadcnComponents.Slider,
    Button: shadcnComponents.Button,
    Link: shadcnComponents.Link,
    DropdownMenu: shadcnComponents.DropdownMenu,
    Toggle: shadcnComponents.Toggle,
    ToggleGroup: shadcnComponents.ToggleGroup,
    ButtonGroup: shadcnComponents.ButtonGroup,
    Pagination: shadcnComponents.Pagination,
    BulletList,
    NumberedList,
    Tweet,
    TodoList,
  },
});
