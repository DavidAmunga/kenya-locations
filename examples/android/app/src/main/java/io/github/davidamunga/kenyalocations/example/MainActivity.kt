package io.github.davidamunga.kenyalocations.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.MenuAnchorType
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.PrimaryTabRow
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Tab
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import ke.locations.Constituency
import ke.locations.County
import ke.locations.KenyaLocations
import ke.locations.SearchResult
import ke.locations.SearchType
import ke.locations.Ward

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent { ExampleApp() }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ExampleApp() {
    var tab by remember { mutableIntStateOf(0) }

    MaterialTheme(colorScheme = lightColorScheme()) {
        Scaffold(
            topBar = {
                TopAppBar(title = { Text("kenya-locations") })
            },
        ) { innerPadding ->
            Column(Modifier.padding(innerPadding)) {
                PrimaryTabRow(selectedTabIndex = tab) {
                    Tab(selected = tab == 0, onClick = { tab = 0 }, text = { Text("Explore") })
                    Tab(selected = tab == 1, onClick = { tab = 1 }, text = { Text("Search") })
                }
                if (tab == 0) ExplorePane() else SearchPane()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ExplorePane() {
    val counties = remember { KenyaLocations.getCounties() }
    var county by remember { mutableStateOf<County?>(null) }
    var constituency by remember { mutableStateOf<Constituency?>(null) }
    var ward by remember { mutableStateOf<Ward?>(null) }

    val constituencies = remember(county) {
        county?.let { KenyaLocations.getConstituenciesInCounty(it.name) }.orEmpty()
    }
    val wards = remember(constituency) {
        constituency?.let { KenyaLocations.getWardsInConstituency(it.name) }.orEmpty()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text(
            "County → constituency → ward. Same getters as Maven: io.github.davidamunga:kenya-locations.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        LocationDropdown(
            label = "County",
            options = counties,
            selected = county,
            labelFor = { it.name },
            onSelect = {
                county = it
                constituency = null
                ward = null
            },
        )
        LocationDropdown(
            label = "Constituency",
            options = constituencies,
            selected = constituency,
            enabled = county != null,
            labelFor = { it.name },
            onSelect = {
                constituency = it
                ward = null
            },
        )
        LocationDropdown(
            label = "Ward",
            options = wards,
            selected = ward,
            enabled = constituency != null,
            labelFor = { it.name },
            onSelect = { ward = it },
        )
        county?.let { selected ->
            Text(
                buildString {
                    append(selected.name)
                    if (selected.capital != selected.name) append(" · ${selected.capital}")
                    append(" · ${selected.region}")
                    append(" · ${selected.population_2019} (2019)")
                },
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun <T> LocationDropdown(
    label: String,
    options: List<T>,
    selected: T?,
    labelFor: (T) -> String,
    onSelect: (T) -> Unit,
    enabled: Boolean = true,
) {
    var expanded by remember { mutableStateOf(false) }

    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { if (enabled) expanded = it },
    ) {
        OutlinedTextField(
            modifier = Modifier
                .fillMaxWidth()
                .menuAnchor(MenuAnchorType.PrimaryNotEditable),
            readOnly = true,
            enabled = enabled,
            value = selected?.let(labelFor).orEmpty(),
            onValueChange = {},
            label = { Text(label) },
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded) },
        )
        ExposedDropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
            options.forEach { option ->
                DropdownMenuItem(
                    text = { Text(labelFor(option)) },
                    onClick = {
                        onSelect(option)
                        expanded = false
                    },
                )
            }
        }
    }
}

@Composable
private fun SearchPane() {
    var query by remember { mutableStateOf("") }
    val results = remember(query) {
        if (query.length < 2) emptyList() else KenyaLocations.search(query, limit = 16)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text(
            "Typos are fine. Try Nairob, Westlnds, or Karen.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        OutlinedTextField(
            modifier = Modifier.fillMaxWidth(),
            value = query,
            onValueChange = { query = it },
            label = { Text("Search") },
            singleLine = true,
        )
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(bottom = 24.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            items(results, key = { "${it.type}-${it.itemName()}" }) { result ->
                Column {
                    Text(result.itemName(), style = MaterialTheme.typography.bodyLarge)
                    Text(
                        result.type.label(),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        }
    }
}

private fun SearchType.label(): String = name.lowercase().replace('_', '-')

private fun SearchResult<*>.itemName(): String = when (val value = item) {
    is County -> value.name
    is Constituency -> value.name
    is Ward -> value.name
    is ke.locations.SubCounty -> value.name
    is ke.locations.Locality -> value.name
    is ke.locations.Area -> value.name
    else -> value.toString()
}
