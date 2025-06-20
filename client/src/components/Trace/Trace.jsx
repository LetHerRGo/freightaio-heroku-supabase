import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Table,
  Flex,
  Heading,
  Highlight,
  Button,
  Badge,
  Portal,
  Menu,
} from "@chakra-ui/react";
import { IoIosMore } from "react-icons/io";
import MovementLogDialog from "../MovementLogDialog/MovementLogDialog";
import DeleteContainerDialog from "../DeleteContainerDialog/DeleteContainerDialog";
import { FaSort } from "react-icons/fa";

function Track() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [ctnrData, setCtnrData] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortByColumn, setSortByColumn] = useState();
  const [sortOrder, setSortOrder] = useState();

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const token = localStorage.getItem("token");

  const readData = async (sortBy, order) => {
    try {
      let url = `${apiUrl}trace`;
      if (sortBy && order) {
        url += `?sortBy=${sortBy}&order=${order}`;
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setCtnrData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (!token) {
      console.error("Token not found in localStorage");
      return;
    }

    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    readData(sortByColumn, sortOrder);
  }, [sortByColumn, sortOrder]);

  // delete function
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}trace/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Filter out the deleted row from state
      setCtnrData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      setError("Failed to delete container.");
    }
  };

  //sort function
  const handleSort = (column) => {
    setSortByColumn(column);
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    // readData(sortByColumn, sortOrder);
  };

  const openDeleteDialog = (item) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const openLogDialog = (item) => {
    setSelectedItem(item);
    setLogDialogOpen(true);
  };

  const closeDialogs = () => {
    setDeleteDialogOpen(false);
    setLogDialogOpen(false);
    setSelectedItem(null);
  };

  // set badge color for different status
  const getStatusColor = (status) => {
    switch (status) {
      case "In Transit":
        return "blue";
      case "Pending":
        return "gray";
      case "Arrived":
        return "orange";
      case "Picked Up":
        return "green";
      case "Need Attention":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <Box ml="50px" p="6" w="auto">
      <Flex direction="column" justify="center" gap="5">
        <Heading size="6xl" letterSpacing="tight" textAlign="center">
          <Highlight query="FREIGHTAIO" styles={{ color: "#79a5b2" }}>
            WELCOME TO THE FREIGHTAIO
          </Highlight>
        </Heading>
        {error && <p className="error">{error}</p>}
        <Box overflowX="auto">
          <Table.Root size="sm" striped>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>
                  <Flex align="center" gap={0}>
                    Container No
                    <FaSort onClick={() => handleSort("container_number")} />
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader>
                  <Flex align="center" gap={0}>
                    Ref#
                    <FaSort onClick={() => handleSort("forwarder_ref")} />
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader>
                  <Flex align="center" gap={0}>
                    Agent <FaSort onClick={() => handleSort("agent_name")} />
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader>
                  <Flex align="center" gap={0}>
                    Client
                    <FaSort onClick={() => handleSort("client_name")} />
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader hideBelow="md">Event</Table.ColumnHeader>
                <Table.ColumnHeader hideBelow="md">
                  Last Event Time
                </Table.ColumnHeader>
                <Table.ColumnHeader hideBelow="md">Location</Table.ColumnHeader>
                <Table.ColumnHeader>Customs Status</Table.ColumnHeader>
                <Table.ColumnHeader>
                  <Flex align="center" gap={0}>
                    Destination
                    <FaSort onClick={() => handleSort("destination")} />
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader>
                  <Flex align="center" gap={0}>
                    ETA
                    <FaSort onClick={() => handleSort("ETA")} />
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader>
                  <Flex align="center" gap={0}>
                    Last Free Day
                    <FaSort
                      onClick={() => handleSort("storage_last_free_day")}
                    />
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader>
                  <Flex align="center" gap={0}>
                    Status
                    <FaSort onClick={() => handleSort("status")} />
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {ctnrData?.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.container_number}</Table.Cell>
                  <Table.Cell>{item.forwarder_ref}</Table.Cell>
                  <Table.Cell>{item.agent_name}</Table.Cell>
                  <Table.Cell>{item.client_name}</Table.Cell>

                  <Table.Cell hideBelow="md">
                    {item.event_description}
                  </Table.Cell>
                  <Table.Cell hideBelow="md">
                    {new Date(item.event_time).toLocaleString()}
                  </Table.Cell>
                  <Table.Cell hideBelow="md">{item.location}</Table.Cell>
                  <Table.Cell>{item.customs_status}</Table.Cell>
                  <Table.Cell>{item.destination}</Table.Cell>
                  <Table.Cell>
                    {item.ETA ? new Date(item.ETA).toLocaleString() : "N/A"}
                  </Table.Cell>
                  <Table.Cell>
                    {item.storage_last_free_day
                      ? new Date(
                          item.storage_last_free_day
                        ).toLocaleDateString()
                      : "N/A"}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      colorPalette={getStatusColor(item.status)}
                      variant="surface"
                    >
                      {item.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Menu.Root>
                      <Menu.Trigger asChild>
                        <Button variant="outline" size="sm">
                          <IoIosMore />
                        </Button>
                      </Menu.Trigger>
                      <Portal>
                        <Menu.Positioner>
                          <Menu.Content>
                            <Menu.Item
                              value="new-txt"
                              onClick={() => openLogDialog(item)}
                            >
                              Log
                            </Menu.Item>
                            <Menu.Item
                              value="delete"
                              color="fg.error"
                              _hover={{ bg: "bg.error", color: "fg.error" }}
                              onClick={() => openDeleteDialog(item)}
                            >
                              Delete
                            </Menu.Item>
                          </Menu.Content>
                        </Menu.Positioner>
                      </Portal>
                    </Menu.Root>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
        {deleteDialogOpen && selectedItem && (
          <DeleteContainerDialog
            isOpen={deleteDialogOpen}
            onClose={closeDialogs}
            onConfirm={async () => {
              await handleDelete(selectedItem.id);
              closeDialogs();
            }}
            containerNumber={selectedItem.container_number}
          />
        )}
        {logDialogOpen && selectedItem && (
          <MovementLogDialog
            isOpen={logDialogOpen}
            containerId={selectedItem.id}
            containerNumber={selectedItem.container_number}
            onClose={closeDialogs}
          />
        )}
      </Flex>
    </Box>
  );
}

export default Track;
