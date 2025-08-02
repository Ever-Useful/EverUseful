require('dotenv').config({ path: './.env' });
const fs = require('fs');
const path = require('path');
const dynamoDBService = require('../services/dynamoDBService');

async function migrateMarketplaceData() {
  try {
    console.log('Starting marketplace data migration...');
    
    // Read the existing marketplace JSON file
    const marketplacePath = path.join(__dirname, '../data/marketplace.json');
    const marketplaceData = JSON.parse(fs.readFileSync(marketplacePath, 'utf8'));
    
    console.log(`Found ${marketplaceData.projects.length} projects to migrate`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Migrate each project
    for (const project of marketplaceData.projects) {
      try {
        // Convert the project data to match DynamoDB structure
        const projectData = {
          id: project.id.toString(), // Ensure ID is string
          title: project.title,
          description: project.description,
          image: project.image,
          images: project.images || [],
          category: project.category,
          price: project.price,
          duration: project.duration,
          rating: project.rating,
          reviews: project.reviews,
          author: project.author,
          status: project.status,
          posted: project.posted,
          teamSize: project.teamSize,
          tags: project.tags || [],
          skills: project.skills || [],
          features: project.features || [],
          techStack: project.techStack || [],
          deliverables: project.deliverables || [],
          views: project.views || 0,
          favoritedBy: project.favoritedBy || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Create the project in DynamoDB
        await dynamoDBService.createMarketplaceItem(projectData);
        successCount++;
        console.log(`✓ Migrated project: ${project.title}`);
        
      } catch (error) {
        errorCount++;
        console.error(`✗ Failed to migrate project ${project.title}:`, error.message);
      }
    }
    
    console.log('\nMigration completed!');
    console.log(`Successfully migrated: ${successCount} projects`);
    console.log(`Failed to migrate: ${errorCount} projects`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateMarketplaceData(); 